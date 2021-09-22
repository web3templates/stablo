import { createElement, PureComponent } from 'react';
import ArrowKeyNavigation from '../';

export default class ArrowKeyNavigationDemo extends PureComponent {
    state = {
        items: [ 'lorem', 'ipsum', 'dolor' ],
    }

    render() {
        return (
            <div className='spread'>
                <section>
                    <h6>Horizontal-only</h6>
                    <ArrowKeyNavigation className='demo-loose-list' mode={ArrowKeyNavigation.mode.HORIZONTAL}>
                        {this.state.items.map((item) => <span key={item}>{item}</span>)}
                    </ArrowKeyNavigation>
                </section>

                <section>
                    <h6>Vertical-only</h6>
                    <ArrowKeyNavigation component='ul' mode={ArrowKeyNavigation.mode.VERTICAL}>
                        {this.state.items.map((item) => <li key={item}>{item}</li>)}
                    </ArrowKeyNavigation>
                </section>

                <section>
                    <h6>Both directions</h6>
                    <ArrowKeyNavigation component='ol' mode={ArrowKeyNavigation.mode.BOTH}>
                        {this.state.items.map((item) => <li key={item}>{item}</li>)}
                    </ArrowKeyNavigation>
                </section>

                <section>
                    <h6>Second child active by default</h6>
                    <ArrowKeyNavigation component='ul' mode={ArrowKeyNavigation.mode.VERTICAL} defaultActiveChildIndex={1}>
                        {this.state.items.map((item) => <li key={item}>{item}</li>)}
                    </ArrowKeyNavigation>
                </section>

                <section>
                    <h6>Ignored child (horizontal rule)</h6>
                    <ArrowKeyNavigation>
                        <div>lorem</div>
                        <hr tabIndex='-1' />
                        <div>dolor</div>
                    </ArrowKeyNavigation>
                </section>
            </div>
        );
    }
}
