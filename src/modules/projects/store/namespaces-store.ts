import { action, makeAutoObservable, observable } from 'mobx'

import { Namespace } from '../types/namespace'

export class NamespacesStore {
  @observable
  public namespaces: Namespace[] = []

  @observable
  public isLoading = false

  constructor() {
    makeAutoObservable(this)
  }

  @action
  public setGroups(namespaces: Namespace[]) {
    this.namespaces = namespaces
  }

  @action setIsLoading(value: boolean) {
    this.isLoading = value
  }
}

export const namespacesStore = new NamespacesStore()
