import { View   } from 'curvature/base/View';
import { Entity } from '../entity/Entity';

export class Stage extends View
{
	constructor(args)
	{
		super(args);

		this.args.rootEntity = this.args.rootEntity || null;
		this.template        = require('./stage.tmp');
		this.focused         = null;

		this.document        = null;
		this.head            = null;
		this.body            = null;

		this.args.bindTo('rootEntity', (v) => {
			if(!v)
			{
				return;
			}

			v.stage = this;
		});

		this._attached = false;

		this.resizeListener = (event) =>{
			let _window = event.target;
			console.log(_window.innerWidth, _window.innerHeight);
		}
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
		if(!this.tags.stage)
		{
			return;
		}

		return this.tags.stage.element.contentWindow;
	}

	attached(event)
	{
		if(this._attached)
		{
			return;
		}

		let _window = this.getWindow();

		if(_window)
		{
			let _document = _window.document;

			_window.addEventListener('resize', this.resizeListener);

			this.cleanup.push(()=>{
				_window.removeEventListener('resize', this.resizeListener);				
			});

			this.args.rootEntity.render(_document.querySelector('body'));

			this._attached = true;
		}

	}
}
