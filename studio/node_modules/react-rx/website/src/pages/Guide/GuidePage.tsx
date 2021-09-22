import {Header} from '../../components/Header'
import MDXContent, {Toc} from './Guide.mdx'
import * as React from 'react'
import {MDXProvider} from '@mdx-js/react'
import {components, tocComponents} from '../../mdx-components'
import {Container, Content} from '../styles'
import {Sidebar} from '../../components/Sidebar'

export const GuidePage = () => (
  <>
    <Header />
    <Container>
      <Sidebar heading="Guide">
        <MDXProvider components={tocComponents}>
          <Toc />
        </MDXProvider>
      </Sidebar>
      <Content>
        <MDXProvider components={components}>
          <MDXContent />
        </MDXProvider>
      </Content>
    </Container>
  </>
)
