import { View } from 'curvature/base/View';

export class Entry extends View
{
	constructor(args)
	{
		super(args);

		this.template      = require('./entry.tmp');
		this.args.content  = '';
		this.args.expanded = 'expanded';
		this.args.icon     = 'x';
	}

	click(event)
	{
		if(this.args.expanded === 'expanded')
		{
			this.args.expanded = 'collapsed';
			this.args.icon     = '+';
			return;
		}

		this.args.expanded = 'expanded';
		this.args.icon     = 'x';
	}
}
