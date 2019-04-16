import { View } from 'curvature/base/View';

export class Toolbar extends View
{
	constructor(args)
	{
		super(args);
		this.template = require('./toolbar.tmp');
	}

	add(event)
	{
		this.args.main.args.showAdd = true;
	}

	delete(event)
	{
		if(this.args.main.args.showAdd)
		{
			this.args.main.args.showAdd = false;
			return;
		}
		
		// ...
	}
}
