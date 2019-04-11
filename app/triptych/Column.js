import { View }  from 'curvature/base/View';
import { Entry } from './Entry';

import { Properties } from '../properties/Properties';
import { Styler } from '../styler/Styler';
import { Stator } from '../stator/Stator';

export class Column extends View
{
	constructor(args)
	{
		super(args);

		this.template      = require('./column.tmp');
		this.args.expanded = 'expanded';
		let mainEntry      = new Entry;
		this.args.entries  = [mainEntry];

		for(let i = 0; i < 3; i++)
		{
			let entry = new Entry;

			entry.args.title   = `Title for ${i}`;
			entry.args.content = `Content for ${i}`;

			if(i === 2)
			{
				entry.args.title   = 'Styles';
				entry.args.content = new Styler;
			}

			if(i === 1)
			{
				entry.args.title   = 'States';
				entry.args.content = new Stator;
			}

			if(i === 0)
			{
				entry.args.title   = 'Properties';
				entry.args.content = new Properties;
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
