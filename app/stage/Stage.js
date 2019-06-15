import { View   } from 'curvature/base/View';
import { Entity } from '../entity/Entity';

export class Stage extends View
{
	constructor(args)
	{
		super(args);

		this.args.rootEntity  = this.args.rootEntity || null;
		this.template         = require('./stage.tmp');
		this.focused          = null;

		this.args.zoom        = 100;
		this.args.stageHeight = 100;
		this.args.zoomHeight  = 100;

		this.args.bindTo('rootEntity', (v) => {
			if(!v)
			{
				return;
			}

			v.stage = this;
		});

		this._attached      = false;
		this.resizeListener = (event) =>{

			let zoomRatio         = 100 / this.args.zoom;
			this.args.zoomHeight  = this.stageRoot.clientHeight;
			this.args.stageHeight = this.args.zoomHeight * zoomRatio;
		};

		this.stageResizeListener = (event) =>{

			let _window               = event.target;
			this.root.args.resolution = `${_window.innerWidth} ⨉ ${_window.innerHeight}`;

		}
	}

	postRender()
	{
		this.root.args.bindTo('zoom', (v) => {

			this.args.zoom        = v;
			let zoom              = 1*v || 100;
			this.args.stageHeight = this.args.zoomHeight * (100/zoom);

		});
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

	getWindow()
	{
		if(!this.tags.stage || !this.tags.stage.element)
		{
			return;
		}

		// console.log(this.tags.stage);

		return this.tags.stage.element.contentWindow;
	}

	attached(event)
	{
		if(this._attached)
		{
			return;
		}

		this.stageRoot = this.findTag(`[stage-root]`);

		this.args.stageHeight = this.stageRoot.clientHeight;
		this.args.zoomHeight  = this.stageRoot.clientHeight;

		window.addEventListener('resize', this.resizeListener);

		this.cleanup.push(()=>{
			window.removeEventListener('resize', this.resizeListener);
		});

		let _window = this.getWindow();

		if(_window)
		{
			_window.addEventListener('resize', this.stageResizeListener);

			this.root.args.resolution = `${_window.innerWidth} ⨉ ${_window.innerHeight}`;

			this.cleanup.push(()=>{
				_window.removeEventListener('resize', this.stageResizeListener);
			});

			let _document = _window.document;

			let _html   = _document.querySelector('html');
			let _body   = _document.querySelector('body');
			let subDoc  = _html.parentNode;

			_html.parentNode.removeChild(_html);

			this.args.rootEntity.render(subDoc);

			this.args.rootEntity.stageAttached(this, event);

			this._attached = true;
		}

	}
}
