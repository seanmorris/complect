import { View } from 'curvature/base/View';

export class Toolbar extends View
{
	constructor(args)
	{
		super(args);
		this.template = require('./toolbar.tmp');
	}

	add(event, newState)
	{
		// this.args.main.add(newState);
	}
}
