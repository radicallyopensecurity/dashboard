import { marked } from 'marked'

import { ProjectDetailsFinding } from '@/modules/projects/types/project-details'
import { ProjectFindingDetails } from '@/modules/projects/types/project-findings'

export const findingMarkdownHtml = (
  // these types are very confusing
  // #TODO: rename to something more sane
  finding: ProjectDetailsFinding,
  details: ProjectFindingDetails
): string => {
  const descriptionMarkdown = marked(finding.description, {
    gfm: true,
  }) as string

  const technicalDescriptionMarkdown = marked(details.technicalDescription, {
    gfm: true,
  }) as string

  const impactMarkdown = marked(details.impact, {
    gfm: true,
  }) as string

  const recommendationMarkdown = marked(details.recommendation, {
    gfm: true,
  }) as string

  const htmlContent = `
    <section>
      ${descriptionMarkdown}
    </section>

    </section>
    <h3>Technical Description</h3>
      ${technicalDescriptionMarkdown}
    </section>

    </section>
      <h3>Impact</h3>
      ${impactMarkdown}
    </section>

    </section>
      <h3>Recommendation</h3>
      ${recommendationMarkdown}
    </section>`

  return htmlContent
}
