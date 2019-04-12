import { View }  from 'curvature/base/View';
import { Entry } from './Entry';

import { Properties } from '../properties/Properties';
import { Styler }     from '../styler/Styler';
import { Stator }     from '../stator/Stator';
import { Builder }    from '../builder/Builder';

export class Column extends View
{
	constructor(args)
	{
		super(args);

		this.template      = require('./column.tmp');
		this.args.expanded = 'expanded';
		let mainEntry      = new Entry;
		this.args.entries  = [mainEntry];

		let content = {
			'Properties':  new Properties
			, 'Structure': new Builder
			, 'States':    new Stator
			, 'Styles':    new Styler
		};

		for(let i in content)
		{
			let entry = new Entry;

			entry.args.title   = i;
			entry.args.content = content[i];

			if(content[i].toolbar)
			{
				entry.args.toolbar = content[i].toolbar;
			}

			this.args.entries.push(entry);
		}

		this.cleanup.push(mainEntry.args.bindTo('expanded', (v)=>{
			this.args.expanded = v;
		}));

		this.args.bindTo('title', (v) => {
			mainEntry.args.title = v;
		});
	}
}
