/**
 * @providesModule ParallaxMixin
 */
'use strict';

var {
  Animated,
} = require('react-native');

var ParallaxMixin = {
  componentWillMount: function() {
    console.log('Parallax.Mixin is deprecated, use Parallax.ScrollView instead');
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
