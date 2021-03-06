import { Column } from './Column';
import { Entry  } from './Entry';

import { Properties }  from '../properties/Properties';
import { Styler }      from '../styler/Styler';
import { Stator }      from '../stator/Stator';
import { Builder }     from '../builder/Builder';

export class ObjectColumn extends Column
{
	constructor(args)
	{
		super(args);

		this.args.title = 'Component';

		this.mainEntry.args.expanded = 'expanded';
		this.content       = {
			'Structure':    new Builder
			, 'Properties': new Properties
			, 'States':     new Stator
			, 'Styles':     new Styler
		};
	}
}
