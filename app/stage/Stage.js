import { View   } from 'curvature/base/View';
import { Entity } from './Entity';

export class Stage extends View
{
	constructor(args)
	{
		super(args);

		this.args.rootEntity = this.args.rootEntity || new Entity;
		this.template        = require('./stage.tmp');
	}

	getTemplate()
	{
		return this.args.rootEntity.compileTemplate();
	}

	getStyle()
	{
		return this.args.rootEntity.compileStyles();
	}
}
