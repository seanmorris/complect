import { Column } from './Column';
import { Entry  } from './Entry';

import { ProjectEntry } from '../project/ProjectEntry';
import { Templates } from '../templates/Templates';
import { Components } from '../components/Components';

export class ProjectColumn extends Column
{
	constructor(args)
	{
		super(args);

		this.args.icon  = '/favicon.ico';
		this.args.title = 'complect 0.011';

		this.mainEntry.args.expanded = 'expanded';
		this.content       = {
			'Project':      new ProjectEntry
			, 'Templates':  new Templates
			, 'Components': new Components
		};
	}
}
