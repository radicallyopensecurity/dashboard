import { action, makeAutoObservable, observable } from 'mobx'

import { Template } from './types/template'

export class TemplatesStore {
  @observable
  public templates: Template[] = []

  @observable
  public isLoading = false

  constructor() {
    makeAutoObservable(this)
  }

  @action
  public setTemplates(namespaces: Template[]) {
    this.templates = namespaces
  }

  @action setIsLoading(value: boolean) {
    this.isLoading = value
  }
}

export const templatesStore = new TemplatesStore()
