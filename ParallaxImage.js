/* @flow */

import React from 'react'
import PropTypes from 'prop-types'
import {
	View,
	Image,
	Animated,
	StyleSheet,
	Dimensions,
	TouchableHighlight,
	ViewPropTypes
} from 'react-native'
import { isEqual } from 'lodash'

const WINDOW_HEIGHT = Dimensions.get('window').height

type Props = {
	parallaxFactor: number
}

type State = {
	isLayoutStale: boolean,
	offset: number,
	height: number,
	width: number
}

class ParallaxImage extends React.Component<Props, State> {
	static propTypes: {
		onPress: PropTypes.func,
		scrollY: PropTypes.object,
		parallaxFactor: PropTypes.number,
		imageStyle: ViewPropTypes.style,
		overlayStyle: ViewPropTypes.style
	}

	constructor(props: Props) {
		super(props)
		this.state = {
			isLayoutStale: true,
			offset: 0,
			height: 0,
			width: 0
		}
	}

	componentWillReceiveProps(nextProps: Props) {
		if (!isEqual(nextProps, this.props)) {
			this.setState({ isLayoutStale: true })
		}
	}

	// Measure again since onLayout event won't pass the offset
	handleLayout = (event: Event) => {
		if (this.state.isLayoutStale) {
			;(this._touchable || this._container).measure(this.handleMeasure)
		}
	}

	handleMeasure = (ox, oy, width, height, px, py) => {
		this.setState({
			offset: py,
			height,
			width,
			isLayoutStale: false
		})
	}

	render() {
		const { offset, width, height } = this.state
		const {
			onPress,
			scrollY,
			parallaxFactor,
			style,
			imageStyle,
			overlayStyle,
			children,
			...props
		} = this.props
		const parallaxPadding = height * parallaxFactor

		const parallaxStyle = {
			height: height + parallaxPadding * 2,
			width: width
		}

		if (scrollY) {
			parallaxStyle.transform = [
				{
					translateY: scrollY.interpolate({
						inputRange: [offset - height, offset + WINDOW_HEIGHT + height],
						outputRange: [-parallaxPadding, parallaxPadding]
					})
				}
			]
		} else {
			parallaxStyle.transform = [{ translateY: -parallaxPadding }]
		}

		var content = (
			<View
				ref={component => (this._container = component)}
				style={[style, styles.container]}
				onLayout={this.handleLayout}
			>
				<Animated.Image
					{...props}
					style={[imageStyle, parallaxStyle]}
					pointerEvents="none"
				/>
				<View style={[styles.overlay, overlayStyle]}>{children}</View>
			</View>
		)
		// Since we can't allow nested Parallax.Images, we supply this shorthand to wrap a touchable
		// around the element
		if (onPress) {
			return (
				<TouchableHighlight
					ref={component => (this._touchable = component)}
					onPress={onPress}
				>
					{content}
				</TouchableHighlight>
			)
		}
		return content
	}
}

var styles = StyleSheet.create({
	container: {
		overflow: 'hidden',
		position: 'relative'
	},
	overlay: {
		flex: 1,
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0
	}
})

module.exports = ParallaxImage
