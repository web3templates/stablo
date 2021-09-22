import {Header} from '../../components/Header'
import {Container, Content} from '../styles'
import MDXContent, {Toc} from './Api.mdx'
import * as React from 'react'
import {MDXProvider} from '@mdx-js/react'
import {components, tocComponents} from '../../mdx-components'
import {Sidebar} from '../../components/Sidebar'

export const ApiPage = () => (
  <>
    <Header />
    <Container>
      <Sidebar heading="API Reference">
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
