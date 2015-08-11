/**
 * @providesModule ParallaxImage
 */
'use strict';

var _ = require('lodash');
var React = require('react-native');
var {
  View,
  Animated,
  StyleSheet,
  Dimensions,
} = React;

var flattenStyle = require('react-native/Libraries/StyleSheet/flattenStyle');
var StyleSheetPropType = require('react-native/Libraries/StyleSheet/StyleSheetPropType');
var ViewStylePropTypes = require('react-native/Libraries/Components/View/ViewStylePropTypes');
var ImageStylePropTypes = require('react-native/Libraries/Image/ImageStylePropTypes');

var WINDOW_HEIGHT = Dimensions.get('window').height;

var ParallaxImage = React.createClass({
  propTypes: {
    scrollY:        React.PropTypes.object.isRequired,
    parallaxFactor: React.PropTypes.number,
    overlayStyle:   StyleSheetPropType(ViewStylePropTypes),
  },

  getDefaultProps: function() {
    return {
      parallaxFactor: 0.2,
    };
  },

  getInitialState: function() {
    this.isLayoutStale = true;
    return {
      offset: 0,
      height: 0,
      width:  0,
    };
  },

  // Needed to be able to wrap the image with a Touchable*
  setNativeProps: function(nativeProps) {
    this._root.setNativeProps(nativeProps);
  },

  // Measure again since onLayout event won't pass the offset
  handleLayout: function(event) {
    if(this.isLayoutStale) {
      this._root.measure(this.handleMeasure);
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if(!_.isEqual(nextProps, this.props)) {
      this.isLayoutStale = true;
    }
  },

  handleMeasure: function(ox, oy, width, height, px, py) {
    this.isLayoutStale = false;
    this.setState({
      offset: py,
      height,
      width,
    });
  },

  render: function() {
    var { offset, width, height } = this.state;
    var { scrollY, parallaxFactor } = this.props;
    var parallaxPadding = height * parallaxFactor;

    // Ignore styles not specific to the image, such as margin
    var imageStyle = _.pick(flattenStyle(this.props.style), Object.keys(ImageStylePropTypes));
    imageStyle.height = height + parallaxPadding * 2;
    imageStyle.width = width;
    if(scrollY) {
      imageStyle.transform = [
        {
          translateY:   scrollY.interpolate({
            inputRange:   [offset - height, offset + WINDOW_HEIGHT + height],
            outputRange:  [-parallaxPadding, parallaxPadding]
          }),
          extrapolate:  'clamp',
        },
      ];
    } else {
      imageStyle.transform = [
        { translateY: -parallaxPadding },
      ];
    }
    var props = _.omit(this.props, 'style', 'children', 'scrollY', 'parallaxFactor');
    return (
      <View
        ref={component => this._root = component}
        style={[this.props.style, styles.container]}
        onLayout={this.handleLayout}
      >
        <Animated.Image
          {...props}
          style={imageStyle}
          pointerEvents="none"
        />
        <View style={[styles.overlay, this.props.overlayStyle]}>
          {this.props.children}
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

module.exports = ParallaxImage;
