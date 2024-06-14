import { SignalWatcher } from '@lit-labs/preact-signals'
import { SlInput, SlSelect } from '@shoelace-style/shoelace'
import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { Ref, createRef, ref } from 'lit/directives/ref.js'

import { theme } from '@/theme/theme'

import { QUOTE_PROJECT_TAG } from '@/constants/projects'

import { appSignal } from '@/modules/app/signals/app-signal'
import { updateTitle } from '@/modules/app/utils/update-title'

import { createProjectQuery } from '@/modules/projects/queries/create-project-query'
import { namespacesQuery } from '@/modules/projects/queries/namespaces-query'
import { templatesQuery } from '@/modules/projects/queries/templates-query'

@customElement('project-new-page')
export class ProjectNewPage extends SignalWatcher(LitElement) {
  private formRef: Ref<HTMLFormElement> = createRef()

  private namespaceRef: Ref<SlSelect> = createRef()
  private nameRef: Ref<SlInput> = createRef()
  private templateRef: Ref<SlSelect> = createRef()

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.formRef.value?.removeEventListener('submit', (e) => {
      void this.onSubmit(e)
    })
  }

  protected firstUpdated(): void {
    updateTitle('New project')

    this.formRef.value?.addEventListener('submit', (e) => {
      void this.onSubmit(e)
    })
  }

  static styles = [
    ...theme,
    css`
      #inputs {
        display: flex;
        flex-direction: column;
        gap: var(--sl-spacing-x-large);
        margin-top: var(--sl-spacing-x-large);
      }

      #button {
        text-align: right;
      }

      #button::part(base) {
        width: auto;
      }
    `,
  ]

  protected async onSubmit(e: Event) {
    e.preventDefault()
    e.stopPropagation()

    if (!appSignal.gitLabToken) {
      return appSignal.setShowGitLabTokenDialog(true)
    }

    const namespaceValue = this.namespaceRef.value?.value
    const name = this.nameRef.value?.value
    const templateValue = this.templateRef.value?.value

    if (!namespaceValue || !name || !templateValue) {
      throw new Error('values not defined')
    }

    const namespaceData = namespacesQuery.data ?? []
    const templateData = templatesQuery.data ?? []

    const namespace = namespaceData.find(
      (namespace) => namespace.id === Number(namespaceValue)
    )
    const template = templateData.find(
      (template) => template.name === templateValue
    )

    if (!namespace || !template) {
      throw new Error('namespace or template not found')
    }

    const result = await createProjectQuery.fetch([
      template.url,
      name,
      QUOTE_PROJECT_TAG,
      namespace.id,
    ])

    window.location.href = `/projects/${result.pathWithNamespace}`
  }

  render() {
    return html`
      <sl-card>
        <h2>Create new project</h2>
        <form ${ref(this.formRef)} id="inputs" action="">
          <sl-select ${ref(this.namespaceRef)} label="Namespace" required>
            ${map(
              namespacesQuery.data ?? [],
              (namespace) => html`
                <sl-option value=${namespace.id}>${namespace.path}</sl-option>
              `
            )}
          </sl-select>
          <sl-input
            ${ref(this.nameRef)}
            label="Project name (Allowed characters: a-z and-)"
            required
            pattern="[a-z0-9\\-]+"
            clearable
            placeholder="pen-ie11"
          ></sl-input>
          <sl-select
            ${ref(this.templateRef)}
            label="Template"
            value="offerte"
            required
          >
            ${map(
              templatesQuery.data ?? [],
              (template) => html`
                <sl-option value=${template.name}>${template.name}</sl-option>
              `
            )}
          </sl-select>
          <sl-button variant="primary" id="button" type="submit"
            >Create</sl-button
          >
        </form>
      </sl-card>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'project-new-page': ProjectNewPage
  }
}
