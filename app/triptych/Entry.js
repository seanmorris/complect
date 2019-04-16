import { View } from 'curvature/base/View';

export class Entry extends View
{
	constructor(args)
	{
		super(args);

		this.template      = require('./entry.tmp');
		this.args.title    = 'Entry';
		this.args.logo     = this.args.logo || '';
		this.args.toolbar  = '';
		// this.args.toolbar  = 'toolbar';
		this.args.content  = '';
		this.args.expanded = 'expanded';

		this.args.bindTo('expanded', (v, k) => {
			if(v === 'expanded')
			{
				this.args.toggle = '✖';
				return;
			}
			this.args.toggle = '✱';
		});
	}

	click(event)
	{
		console.log(this.args.icon);
		console.log(this.args.title);

		if(this.args.expanded === 'expanded')
		{
			this.args.expanded = 'collapsed';
			return;
		}

		this.args.expanded = 'expanded';
	}
}
