import { Column } from './Column';
import { Entry  } from './Entry';

import { Properties }  from '../properties/Properties';
import { Styler }      from '../styler/Styler';
import { Breakpoints } from '../breakpoints/Breakpoints';
import { Stator }      from '../stator/Stator';
import { Builder }     from '../builder/Builder';

export class ObjectColumn extends Column
{
	constructor(args)
	{
		super(args);

		this.mainEntry.args.expanded = 'expanded';
		this.content       = {
			'Properties':    new Properties
			, 'Structure':   new Builder
			// , 'Breakpoints': new Breakpoints
			, 'States':      new Stator
			, 'Styles':      new Styler
		};
	}
}
