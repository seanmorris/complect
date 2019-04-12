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
		
		this.mainEntry     = new Entry;
		this.args.entries  = [this.mainEntry];

		this.content       = {};		

		this.cleanup.push(this.mainEntry.args.bindTo('expanded', (v)=>{
			this.args.expanded = v;
		}));

		this.mainEntry.args.expanded = 'collapsed';

		this.args.bindTo('title', (v) => {
			this.mainEntry.args.title = v;
		});
	}

	postRender()
	{
		for(let i in this.content)
		{
			let entry = new Entry;

			entry.args.title   = i;
			entry.args.content = this.content[i];

			if(this.content[i].toolbar)
			{
				entry.args.toolbar = this.content[i].toolbar;
			}

			this.args.entries.push(entry);
		}
	}
}
