
import { promises as fs } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createRequire } from 'node:module'

import { getIcons, getIconsCSS } from '@iconify/utils'

const require = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))

const sources = [
  {
    filename: require.resolve('@iconify-json/ri/icons.json'),
  },
  {
    filename: require.resolve('@iconify-json/bxl/icons.json'),
    icons: [
      'facebook',
      'twitter',
      'github',
      'google',
      'linkedin',
    ],
  },
]

const target = join(__dirname, 'icons.css')

async function buildIcons() {
  const allIcons = []

  for (const source of sources) {
    const content = JSON.parse(
      await fs.readFile(source.filename, 'utf8'),
    )

    if (source.icons?.length) {
      const filtered = getIcons(content, source.icons)

      if (!filtered) {
        throw new Error(
          `Unable to load icons from ${source.filename}`,
        )
      }

      allIcons.push(filtered)
    }
    else {
      allIcons.push(content)
    }
  }

  const cssContent = allIcons
    .map(iconSet =>
      getIconsCSS(
        iconSet,
        Object.keys(iconSet.icons),
        {
          iconSelector: '.{prefix}-{name}',
        },
      ),
    )
    .join('\n')

  await fs.writeFile(target, cssContent, 'utf8')

  console.log(`Successfully generated: ${target}`)
}

buildIcons().catch(error => {
  console.error(error)
  process.exitCode = 1
})
