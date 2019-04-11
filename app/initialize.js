import { Tag      } from 'curvature/base/Tag';
import { RuleSet  } from 'curvature/base/RuleSet';
import { Router   } from 'curvature/base/Router';

import { RootView } from './RootView';

RuleSet.add('body', (tag)=>{
	let view = new RootView;

	view.render(tag.element);
});

RuleSet.wait();
// Router.wait();