/**
 * GitHub Gist Sync
 * - Personal Access Token (gist scope) をlocalStorageに保存
 * - 全WeekLogデータをひとつのPrivate Gistに保存・読み込み
 */

const GIST_TOKEN_KEY = "scl_gist_token";
const GIST_ID_KEY = "scl_gist_id";
const GIST_FILENAME = "self-coaching-log.json";

export function getGistToken(): string {
  return localStorage.getItem(GIST_TOKEN_KEY) ?? "";
}

export function setGistToken(token: string) {
  localStorage.setItem(GIST_TOKEN_KEY, token.trim());
}

export function clearGistToken() {
  localStorage.removeItem(GIST_TOKEN_KEY);
  localStorage.removeItem(GIST_ID_KEY);
}

export function getGistId(): string {
  return localStorage.getItem(GIST_ID_KEY) ?? "";
}

function setGistId(id: string) {
  localStorage.setItem(GIST_ID_KEY, id);
}

async function githubFetch(path: string, options: RequestInit = {}) {
  const token = getGistToken();
  if (!token) throw new Error("GitHub Personal Access Tokenが設定されていません");

  const res = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message ?? `GitHub API error: ${res.status}`);
  }

  return res.json();
}

/** トークンが有効かチェック */
export async function verifyToken(): Promise<string> {
  const data = await githubFetch("/user");
  return (data as { login: string }).login;
}

/** データをGistにアップロード（なければ作成、あれば更新） */
export async function pushToGist(data: unknown): Promise<void> {
  const content = JSON.stringify(data, null, 2);
  const gistId = getGistId();

  if (gistId) {
    await githubFetch(`/gists/${gistId}`, {
      method: "PATCH",
      body: JSON.stringify({
        files: { [GIST_FILENAME]: { content } },
      }),
    });
  } else {
    const res = await githubFetch("/gists", {
      method: "POST",
      body: JSON.stringify({
        description: "Self Coaching Log - backup",
        public: false,
        files: { [GIST_FILENAME]: { content } },
      }),
    });
    setGistId((res as { id: string }).id);
  }
}

/** GistからデータをダウンロードしてWeekLogsを返す */
export async function pullFromGist(): Promise<unknown> {
  const gistId = getGistId();
  if (!gistId) throw new Error("同期済みのGistがありません。まず「クラウドへ保存」を実行してください。");

  const res = await githubFetch(`/gists/${gistId}`);
  const file = (res as { files: Record<string, { truncated: boolean; raw_url: string; content: string }> }).files?.[GIST_FILENAME];
  if (!file) throw new Error(`Gist内に ${GIST_FILENAME} が見つかりません`);

  if (file.truncated) {
    const raw = await fetch(file.raw_url);
    return raw.json();
  }

  return JSON.parse(file.content);
}

/** ユーザーのGist一覧から self-coaching-log.json を含むGistを探してIDを復元 */
export async function findExistingGist(): Promise<boolean> {
  const gists = await githubFetch("/gists?per_page=100");
  const found = (gists as Array<{ id: string; files: Record<string, unknown> }>).find(
    (g) => GIST_FILENAME in g.files
  );
  if (found) {
    setGistId(found.id);
    return true;
  }
  return false;
}
