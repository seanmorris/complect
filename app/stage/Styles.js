import { View } from 'curvature/base/View';

export class Styles extends View
{
	constructor(args)
	{
		super(args);
		this.template = require('./styles.tmp');
	}
}
