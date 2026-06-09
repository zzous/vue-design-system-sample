import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'nexus-tgz')
const LOCKFILE = path.join(ROOT, 'pnpm-lock.yaml')

function parsePackageKey(rawKey) {
  let key = rawKey.replace(/^['"]|['"]$/g, '').trim()
  const parenIndex = key.indexOf('(')
  if (parenIndex !== -1) {
    key = key.slice(0, parenIndex)
  }

  const lastAt = key.lastIndexOf('@')

  if (lastAt <= 0) {
    throw new Error(`패키지 키 파싱 실패: ${rawKey}`)
  }

  return {
    name: key.slice(0, lastAt),
    version: key.slice(lastAt + 1),
    lockKey: rawKey,
  }
}

function collectPackagesFromLockfile() {
  const content = fs.readFileSync(LOCKFILE, 'utf8')
  const packages = new Map()
  let inPackages = false

  for (const line of content.split('\n')) {
    if (line === 'packages:') {
      inPackages = true
      continue
    }

    if (!inPackages) continue

    // packages 섹션의 패키지 키는 2칸 들여쓰기, 하위 필드는 4칸 이상
    if (!line.startsWith('  ') || line.startsWith('    ') || !line.endsWith(':')) continue

    const rawKey = line.slice(2, -1).trim()
    if (!rawKey.includes('@')) continue
    const parsed = parsePackageKey(rawKey)
    const spec = `${parsed.name}@${parsed.version}`

    if (!packages.has(spec)) {
      packages.set(spec, parsed)
    }
  }

  return packages
}

function expectedTgzPrefix(name) {
  if (name.startsWith('@')) {
    return name.slice(1).replace('/', '-') + '-'
  }
  return `${name}-`
}

function findExistingTgz({ name, version }) {
  const prefix = expectedTgzPrefix(name)
  const suffix = `-${version}.tgz`
  const files = fs.readdirSync(OUT_DIR).filter((file) => file.endsWith('.tgz'))
  return files.find((file) => file.startsWith(prefix) && file.endsWith(suffix)) ?? null
}

function packPackage({ name, version }) {
  const existing = findExistingTgz({ name, version })
  if (existing) return existing

  const spec = `${name}@${version}`
  const output = execSync(
    `npm pack "${spec}" --pack-destination "${OUT_DIR}" --prefer-offline`,
    {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      maxBuffer: 20 * 1024 * 1024,
      env: {
        ...process.env,
        npm_config_loglevel: 'error',
      },
    },
  ).trim()

  return path.basename(output)
}

function main() {
  if (!fs.existsSync(LOCKFILE)) {
    console.error('pnpm-lock.yaml 이 없습니다. 먼저 pnpm install 을 실행하세요.')
    process.exit(1)
  }

  console.log('pnpm-lock.yaml 에서 의존성 수집 중...')
  console.log('tgz 소스: npm pack (캐시 우선 → 없으면 npm registry)')
  const packages = collectPackagesFromLockfile()
  const sorted = [...packages.values()].sort((a, b) => {
    const nameCompare = a.name.localeCompare(b.name)
    return nameCompare !== 0 ? nameCompare : a.version.localeCompare(b.version)
  })

  fs.mkdirSync(OUT_DIR, { recursive: true })

  console.log(`총 ${sorted.length}개 패키지 tgz 생성 → ${OUT_DIR}`)

  const manifest = []
  let success = 0
  let skipped = 0
  let failed = 0

  for (const pkg of sorted) {
    const spec = `${pkg.name}@${pkg.version}`
    const alreadyExists = findExistingTgz(pkg)
    try {
      const filename = packPackage(pkg)
      manifest.push({
        name: pkg.name,
        version: pkg.version,
        spec,
        filename,
        lockKey: pkg.lockKey,
        skipped: Boolean(alreadyExists),
      })
      if (alreadyExists) {
        skipped++
        console.log(`  [skip ${success + skipped + failed}/${sorted.length}] ${spec}`)
      } else {
        success++
        console.log(`  [${success + skipped + failed}/${sorted.length}] ${spec}`)
      }
    } catch (error) {
      failed++
      const message = error.stderr?.toString() || error.message
      manifest.push({
        name: pkg.name,
        version: pkg.version,
        spec,
        lockKey: pkg.lockKey,
        error: message.trim(),
      })
      console.error(`  [FAIL] ${spec}`)
    }
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    project: 'scc-fe-vite-sample',
    source: 'pnpm-lock.yaml',
    outputDir: 'nexus-tgz',
    total: sorted.length,
    success,
    skipped,
    failed,
    packages: manifest,
  }

  fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), `${JSON.stringify(summary, null, 2)}\n`)

  const tgzCount = fs.readdirSync(OUT_DIR).filter((file) => file.endsWith('.tgz')).length
  console.log('')
  console.log(`완료: tgz ${tgzCount}개, 신규 ${success}, 스킵 ${skipped}, 실패 ${failed}`)
  console.log(`manifest: ${path.join(OUT_DIR, 'manifest.json')}`)

  if (failed > 0) process.exit(1)
}

main()
