import { View     } from 'curvature/base/View';
import { Triptych } from './triptych/Triptych';
import { Pak      } from './pak/Pak';

export class RootView extends View
{
	constructor(args)
	{
		super(args);

		this.template  = require('./rootView.tmp');
		this.args.body = new Triptych;
		this.args.pak  = new Pak;

		this.args.zoom       = '100';
		this.args.customZoom = false;
		this.args.resolution = 'ERROR!';

		this.args.zooms      = [100, '--',10,25,50,75,90,100,110,125,150,200,250];

		this.args.body.root = this;

		this.args.bindTo('zoom', (v) => {
			// this.args.customZoom = (v === '') || this.args.customZoom;
		});
	}

	export(event)
	{
		let right    = this.args.body.args.right;
		let entry    = right.args.entries[1].args.content;
		let name     = entry.args.className;
		let template = this.args.body.args.center.getTemplate();
		let styles   = this.args.body.args.center.getStyle();

		this.args.pak.template(name, template);
		this.args.pak.style(name, styles);

		console.log(this.args.pak.export())
	}
}
