import { Tag      } from 'curvature/base/Tag';
import { RuleSet  } from 'curvature/base/RuleSet';
import { Router   } from 'curvature/base/Router';

import { RootView } from './RootView';

RuleSet.add(':root > body', (tag)=>{
	let view = new RootView;

	if(tag.element, tag.element.parentNode.parentNode !== document)
	{
		return;
	}

	view.render(tag.element);
});

RuleSet.wait();
// Router.wait();