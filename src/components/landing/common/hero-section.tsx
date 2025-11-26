'use client';

import { Carousel } from '@mantine/carousel';
import { Box, Flex, Overlay, Text, Title } from '@mantine/core';
import Image from 'next/image';
import { useRef, useState } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import {
  BLOG_HERO_CONTENT,
  HOME_HERO_CONTENT,
  SUCCESS_STORIES_HERO_CONTENT,
} from '@/content/landing';
import { DESTINATION_HERO_SECTION } from '@/types/landing/index.type';

interface Props {
  destination: DESTINATION_HERO_SECTION;
}

export default function HeroSection({ destination }: Props) {
  const content =
    destination == DESTINATION_HERO_SECTION.HOME
      ? HOME_HERO_CONTENT
      : destination == DESTINATION_HERO_SECTION.BLOG
        ? BLOG_HERO_CONTENT
        : SUCCESS_STORIES_HERO_CONTENT;

  const images = content.map((item) => item.image);

  const autoplay = useRef(Autoplay({ delay: 5000 }));
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = images.map((item, index) => (
    <Carousel.Slide key={index} w='100%' h='100%'>
      <Box h={{ base: 350, md: 400 }} style={{ position: 'relative', width: '100%' }}>
        <Image
          alt={`Slide ${index + 1}`}
          src={item.src}
          fill
          priority={index === 0}
          style={{
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
        />
      </Box>
    </Carousel.Slide>
  ));

  return (
    <Box pos='relative' w='100%' h={{ base: 350, md: 400 }}>
      <Carousel
        w='100%'
        h='100%'
        withControls={false}
        controlSize={48}
        slideSize='100%'
        emblaOptions={{
          loop: true,
          align: 'start',
          slidesToScroll: 1,
        }}
        plugins={[autoplay.current]}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={autoplay.current.reset}
        onSlideChange={setActiveSlide}
      >
        {slides}
      </Carousel>
      <Overlay
        gradient='linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 100%)'
        zIndex={0}
      />
      <Flex
        direction='column'
        justify='center'
        align='start'
        pos='absolute'
        top={'30%'}
        right={{ base: '5%', md: '8%', lg: '10%' }}
        left={{ base: '5%', md: '8%', lg: '10%' }}
        className='z-10! transition-all duration-500'
        dir='rtl'
      >
        <Title order={1} fw={{ base: 600, md: 800 }} fz={{ base: 25, md: 35 }} c='white' ta='right'>
          {content[activeSlide]?.title}
        </Title>
        <Text
          fz={{ base: 16, md: 22, lg: 25 }}
          c='gray.1'
          ta='right'
          mt={24}
          className='leading-relaxed'
          style={{ whiteSpace: 'pre-line' }}
        >
          {content[activeSlide]?.desc}
        </Text>
      </Flex>
    </Box>
  );
}
