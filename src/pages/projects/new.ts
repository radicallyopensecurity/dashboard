import { consume } from '@lit/context'
import { Router } from '@lit-labs/router'
import { SlInput, SlSelect } from '@shoelace-style/shoelace'
import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { Ref, createRef, ref } from 'lit/directives/ref.js'

import { theme } from '@/theme/theme'

import { routerContext } from '@/routes'

import { appStore } from '@/modules/app/app-store'

import { projectsService } from '@/modules/projects/projects-service'
import { namespacesStore } from '@/modules/projects/store/namespaces-store'
import { templatesStore } from '@/modules/projects/store/templates-store'


@customElement('project-new-page')
export class ProjectNewPage extends LitElement {
  private namespacesStore = namespacesStore
  private templatesStore = templatesStore
  private appStore = appStore

  private formRef: Ref<HTMLFormElement> = createRef()

  private namespaceRef: Ref<SlSelect> = createRef()
  private nameRef: Ref<SlInput> = createRef()
  private templateRef: Ref<SlSelect> = createRef()

  @consume({ context: routerContext })
  @property({ attribute: false })
  private router?: Router

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.formRef.value?.removeEventListener('submit', (e) => {
      void this.onSubmit(e)
    })
  }

  protected firstUpdated(): void {
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
    console.log(e)
    e.preventDefault()
    e.stopPropagation()

    if (!this.appStore.gitlabToken) {
      return this.appStore.setGitlabTokenDialog(true)
    }

    const namespaceValue = this.namespaceRef.value?.value
    const name = this.nameRef.value?.value
    const templateValue = this.templateRef.value?.value

    if (!namespaceValue || !name || !templateValue) {
      throw new Error('values not defined')
    }

    const namespace = this.namespacesStore.namespaces.find(
      (namespace) => namespace.id === Number(namespaceValue)
    )
    const template = this.templatesStore.templates.find(
      (template) => template.name === templateValue
    )

    if (!namespace || !template) {
      throw new Error('namespace or template not found')
    }

    const path = await projectsService.createProject(
      template.url,
      name,
      template.name.toLowerCase(),
      namespace.id
    )

    await this.router?.goto(`/projects/${path}`)
  }

  render() {
    return html`
      <sl-card>
        <h2>Create new project</h2>
        <form ${ref(this.formRef)} id="inputs" action="">
          <sl-select ${ref(this.namespaceRef)} label="Namespace" required>
            ${map(
              this.namespacesStore.namespaces,
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
              this.templatesStore.templates,
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
