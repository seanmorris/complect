import { View } from 'curvature/base/View';

export class Entry extends View
{
	constructor(args)
	{
		super(args);

		this.template      = require('./entry.tmp');
		this.args.content  = '';
		this.args.expanded = 'expanded';
	}

	click(event)
	{
		this.args.expanded = this.args.expanded === 'expanded' ? 'collapsed' : 'expanded';
	}
}
