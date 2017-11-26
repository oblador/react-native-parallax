import React from 'react'
import PropTypes from 'prop-types'
import { Animated, ScrollView } from 'react-native'
import isArray from 'lodash/lang/isArray'
import ParallaxImage from './ParallaxImage'

const applyPropsToParallaxImages = (children, props) => {
	if (isArray(children)) {
		return children.map(child => {
			if (isArray(child)) {
				return applyPropsToParallaxImages(child, props)
			}
			if (child.type === ParallaxImage) {
				return React.cloneElement(child, props)
			}
			return child
		})
	}
	if (children.type === ParallaxImage) {
		return React.cloneElement(children, props)
	}
	return children
}

type Props = {
	scrollViewComponent: Function
}
type State = {
	scrollY: Animated.Value
}

class ParallaxScrollViewComposition extends React.Component<Props, State> {
	static propTypes: {
		scrollViewComponent: PropTypes.func
	}

	constructor(props) {
		super(props)
		this.state = {
			scrollY: new Animated.Value(0)
		}
	}

	componentWillMount() {
		this.onParallaxScroll = Animated.event(
			[{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
			{ useNativeDriver: true }
		)
	}

	render() {
		const {
			ref,
			children,
			scrollViewComponent,
			onScroll,
			...props
		} = this.props
		const { scrollY } = this.state
		const ScrollComponent = scrollViewComponent || Animated.ScrollView
		const handleScroll = onScroll
			? event => {
					this.onParallaxScroll(event)
					onScroll(event)
				}
			: this.onParallaxScroll
		return (
			<ScrollComponent
				ref={component => {
					this._root = component
					if (typeof ref === 'function') {
						ref(component)
					}
				}}
				scrollEventThrottle={1}
				onScroll={handleScroll}
				{...props}
			>
				{children && applyPropsToParallaxImages(children, { scrollY })}
			</ScrollComponent>
		)
	}
}

module.exports = ParallaxScrollViewComposition
