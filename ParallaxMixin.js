/**
 * @providesModule ParallaxMixin
 */
'use strict';

var React = require('react-native');
var {
  Animated,
} = React;

var ParallaxMixin = {
  componentWillMount: function() {
    this.images = [];
    var scrollY = new Animated.Value(0);
    this.setState({
      parallaxScrollY: scrollY,
    });
    this.onParallaxScroll = Animated.event(
      [{nativeEvent: {contentOffset: {y: scrollY}}}]
    );
  },
};

module.exports = ParallaxMixin;
