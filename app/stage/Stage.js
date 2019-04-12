import { View   } from 'curvature/base/View';
import { Entity } from '../entity/Entity';

export class Stage extends View
{
	constructor(args)
	{
		super(args);

		this.args.rootEntity = this.args.rootEntity || new Entity;
		this.template        = require('./stage.tmp');
		this.focused         = null;

		this.args.rootEntity.stage = this;
	}

	getTemplate()
	{
		return this.args.rootEntity.compileTemplate();
	}

	getStyle()
	{
		return this.args.rootEntity.compileStyles();
	}

	focus(entity)
	{
		if(this.focused)
		{
			this.focused.blur();

			if(this.focused === entity)
			{
				entity.blur();
				this.focused = null;
				return;
			}
		}

		this.focused = entity;

		this.args.triptych.focus(entity);
	}
}
