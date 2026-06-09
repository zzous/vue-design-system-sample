import axios from 'axios'

// proxy: /gitlab-api → http://210.217.178.98:32000/api/v4

// 상태 확인
// http://210.217.178.98:32000/api/v4/projects/35/merge_requests/2
const MERGE_REQUEST_URL = '/projects/35/merge_requests/6'

// 변경 파일 (changes 배열)
// http://210.217.178.98:32000/api/v4/projects/35/merge_requests/2/changes
const MERGE_REQUEST_CHANGES_URL = '/projects/35/merge_requests/6/changes'

// 파일 raw 조회
// http://210.217.178.98:32000/api/v4/projects/35/repository/files/{path}/raw?ref={branch}
const FILE_RAW_URL = '/projects/35/repository/files'

const GITLAB_ACCESS_TOKEN = 'glpat-Mfw-ZWQ5tjhqtEazNKtinG86MQp1OjEH.01.0w0lcjftv'

const gitlab = axios.create({
  baseURL: '/gitlab-api',
  timeout: 30000,
})

gitlab.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('gitlabToken') ||
      localStorage.getItem('accessToken') ||
      GITLAB_ACCESS_TOKEN

    config.headers.Authorization = `Bearer ${token}`

    return config
  },
  (error) => Promise.reject(error),
)

gitlab.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const data = error.response?.data
    const serverMessage =
      (typeof data === 'string' && data) ||
      data?.message ||
      data?.error ||
      null

    const message = serverMessage || (status ? `HTTP ${status}` : error.message)
    return Promise.reject(new Error(message))
  },
)

/** MR 상태 확인 */
export function getMergeRequestStatus() {
  return gitlab.get(MERGE_REQUEST_URL)
}

/** MR 변경 파일 목록 (changes 배열) */
export function getMergeRequestChanges() {
  return gitlab.get(MERGE_REQUEST_CHANGES_URL)
}

/** 원문 (왼쪽) — source branch */
export function getFileSource(filePath, ref) {
  return getRepositoryFileRaw(filePath, ref)
}

/** 타겟 (오른쪽) — target branch */
export function getFileTarget(filePath, ref) {
  return getRepositoryFileRaw(filePath, ref)
}

function getRepositoryFileRaw(filePath, ref) {
  const encodedPath = encodeURIComponent(filePath)

  return gitlab.get(`${FILE_RAW_URL}/${encodedPath}/raw`, {
    params: { ref },
    responseType: 'text',
  })
}

/** 원문/타겟 비교 */
export async function getFileCompare(filePath, sourceRef, targetRef) {
  const [sourceRes, targetRes] = await Promise.all([
    getFileSource(filePath, sourceRef),
    getFileTarget(filePath, targetRef),
  ])

  return {
    filePath,
    sourceRef,
    targetRef,
    source: sourceRes.data ?? '',
    target: targetRes.data ?? '',
  }
}

export function getLanguageFromPath(filePath) {
  const ext = filePath.split('.').pop()?.toLowerCase()

  const map = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    vue: 'vue',
    json: 'json',
    html: 'html',
    css: 'css',
    scss: 'scss',
    md: 'markdown',
    py: 'python',
    java: 'java',
    xml: 'xml',
    yml: 'yaml',
    yaml: 'yaml',
  }

  return map[ext] ?? 'plaintext'
}

export function mapChangeFiles(changes = []) {
  return changes.map((change) => ({
    path: change.new_path || change.old_path,
    oldPath: change.old_path,
    newPath: change.new_path,
    deleted: change.deleted_file,
    renamed: change.renamed_file,
    newFile: change.new_file,
  }))
}
