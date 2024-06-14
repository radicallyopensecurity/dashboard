import { marked } from 'marked'

import { ProjectDetailsFinding } from '@/modules/projects/types/project-details'
import { ProjectFindingDetails } from '@/modules/projects/types/project-findings'

import { rewriteUploads } from '@/modules/projects/utils/rewrite-uploads'

export const findingMarkdownHtml = (
  // these types are very confusing
  // #TODO: rename to something more sane
  finding: ProjectDetailsFinding,
  details: ProjectFindingDetails,
  baseUrl: string
): string => {
  const descriptionMarkdown = marked(
    rewriteUploads(finding.description, baseUrl),
    {
      gfm: true,
    }
  ) as string

  const typeMarkdown = marked(rewriteUploads(details.type, baseUrl), {
    gfm: true,
  }) as string

  const technicalDescriptionMarkdown = marked(
    rewriteUploads(details.technicalDescription, baseUrl),
    {
      gfm: true,
    }
  ) as string

  const impactMarkdown = marked(rewriteUploads(details.impact, baseUrl), {
    gfm: true,
  }) as string

  const recommendationMarkdown = marked(
    rewriteUploads(details.recommendation, baseUrl),
    {
      gfm: true,
    }
  ) as string

  const sections: { title: string; text: string }[] = []

  if (typeMarkdown) {
    sections.push({ title: 'Type', text: typeMarkdown })
  }

  if (technicalDescriptionMarkdown) {
    sections.push({
      title: 'Technical Description',
      text: technicalDescriptionMarkdown,
    })
  }

  if (impactMarkdown) {
    sections.push({ title: 'Impact', text: impactMarkdown })
  }

  if (recommendationMarkdown) {
    sections.push({ title: 'Recommendation', text: recommendationMarkdown })
  }

  const content = sections
    .map(
      ({ title, text }) => `
    <section>
      <h3>${title}</h3>
      <hr />
      ${text}
    </section>
  `
    )
    .join('\n')

  const htmlContent = `
    <section>
      ${descriptionMarkdown}
    </section>

    ${content}`

  return htmlContent
}
