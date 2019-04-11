import { View } from 'curvature/base/View';

export class Styler extends View
{
	constructor(args)
	{
		super(args);

		this.template    = require('./styler.tmp');
		this.args.styles = {};
		this.args.states = [];
		this.args.focus  = null;
	}

	postRender()
	{
		let prevDebind = null;

		this.args.bindTo('focus', (v,k,t) => {
			if(!v)
			{
				return;
			}

			let styles = getComputedStyle(v.tags.entity.element);

			this.args.styles['width']           = 'auto' || styles.getPropertyValue('background');
			this.args.styles['height']          = 'auto' || styles.getPropertyValue('background');

			this.args.styles['padding']         = styles.getPropertyValue('padding');
			this.args.styles['margin']          = styles.getPropertyValue('margin');
			this.args.styles['border']          = styles.getPropertyValue('border');
			this.args.styles['background']      = styles.getPropertyValue('background');
			this.args.styles['display']         = styles.getPropertyValue('display');
			this.args.styles['flex']            = styles.getPropertyValue('flex');
			this.args.styles['flex-direction']  = styles.getPropertyValue('flex-direction');
			this.args.styles['align-items']     = styles.getPropertyValue('align-items');
			this.args.styles['justify-content'] = styles.getPropertyValue('justify-content');
			this.args.styles['font-family']     = styles.getPropertyValue('font-family');
			this.args.styles['font-size']       = styles.getPropertyValue('font-size');
			this.args.styles['font-weight']     = styles.getPropertyValue('font-weight');

			let showStyles = [
				'color'
				, 'background'
				, 'width'
				, 'height'
				, 'box-sizing'
				, 'display'
				, 'flex'
			];

			for (let i = 0; i < styles.length; i++)
			{
				let name  = styles.item(i);
				let value = styles.getPropertyValue(name);

				if(showStyles.indexOf(name) === -1)
				{
					continue;
				}

				this.args.styles[name] = value;
			}

			let stateBind = v.args.states.bindTo((vv, kk, tt)=>{
				if(!v)
				{
					return;
				}

				this.args.states  = v.activeStates();
				this.args._states = this.args.states.map(x=>`+${x}`).join(' ');

			}, {wait: 0});

			if(prevDebind)
			{
				prevDebind();
			}

			prevDebind = () => {
				stateDebind();
			};
		});

		this.args.styles.bindTo((v,k,t) => {
			if(!this.args.focus)
			{
				return;
			}

			let styles    = getComputedStyle(this.args.focus.tags.entity.element);
			let preValue  = styles.getPropertyValue(k);

			let entity    = this.args.focus;
			let entityTag = entity.tags.entity.element;

			if(v !== preValue)
			{
				entity.addStyle(k, v, this.args.states);

				// entityTag.style[k] = v;
			}

			if(!v)
			{
				this.onTimeout(0, ()=>{
					this.tags.style[k].element.value = styles[k];
					this.args.styles[k]              = styles[k];
				});
			}
		});
	}
}
