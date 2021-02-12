import type DefaultClient from 'apollo-boost'

import type { ApolloClient } from '../../core'

export interface ApolloProviderProps<TCache> {
  client: ApolloClient<TCache> | DefaultClient<TCache>
  children: React.ReactNode | React.ReactNode[] | null
}
export declare const ApolloProvider: React.FC<ApolloProviderProps<any>>
//# sourceMappingURL=ApolloProvider.d.ts.map
