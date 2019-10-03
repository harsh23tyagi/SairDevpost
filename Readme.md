### _This project is a submission to facebook's Developer Circle remote hackathon and is built in just 20 days_

### Devpost Link: https://devpost.com/software/sair-vr-video-chat-platform

## Inspiration

Sometimes we just want our family and friends to be with us, even if we are miles away from them. The closest we get to this is video chatting with them- but it still feels unreal. This very thought inspired me to create an immersive way of video chatting wherein it would seem that the person you are talking to is standing right in front of you and both of the peers are in the same environment using Virtual Reality.

## What it does

Sair, in Hindi means to go on for a peaceful walk or a stroll with someone. This is what this platform does exactly. The conceptual version picks up two people who are video chatting and semantically segment them from their current environment, in real time and put the person in virtual space of each other. The segmented body in the VR space makes you feel that the other person and you are both in the same space and thus justifying the term immersive video chatting...

## How I built it

The whole platform was built in three layers.

Layer - 1) The basic video chat feature was built by exchanging tokens & creating a basic P2P connection. This conventional way of video chat streaming was the easiest way out to replicate a video chat feature. It was made using React, Javascript, nodejs, peerjs, socket-io and similar web technologies.

Layer - 2) As soon as the video chat platform was ready, it was time for semantic segmentation. Semantic segmentation essentially means to pick the person's body from the current environment and subtract the environment from the video stream such that the body is the only object being streamed. I initially started to write my own neural net with OpenCV to do that, but the rendering of one video of 8 seconds in non-real time took about 1 hour on my local machine. Hence I came across, Bodypix library by google scholar which I tweaked a bit to get what I wanted and in real time.

Layer - 3) Now since I had a semantically segmented body in real time, I just have to stream it on the Virtual Reality Environment. To do this, I initially thought of writing the same P2P code (which I wrote in Layer 1)- with React360. But React360 comes with limitations of javascript and HTML5 components. So, I kept the real time segmentation and video stream part for version 2.0 which would be made with Unity instead of React 360. For now, you could record a message on the web portal(Layer-1) and send it to the user using dropbox API. As soon as you stop recording the message from layer 1 - it pushes the message to DropBox App Server. The Virtual Reality App in layer-3, downloads the message from the DropBox App Server and is meant to play that message which has all the segmentation features and makes you feel that the person is right in front of you.

## Challenges I ran into

React 360 is very restrictive way to do this. It does not support the segmentation part on user's end- hence we have to stream the segmented video. It also just plays video which are in the local asset store...
Currently I am just playing a video which I have stored in the local asset store- but the dropbox app server request does work and the downloading does take place. It is just - I wasn't sure about the location of the directory where the downloaded file was saved and ran out of time to figure it out.
Initially the segmentation also took a lot of time and efforts. The problem with segmentation is, currently the video is streamed from one user to another user, from where it goes to google's open source GPUs and then is streamed back after segmentation. This requires high processing and compression rate which as lossless as possible.
Currently the app is not able to live stream the video chat because of React 360's limitation- but the idea can surely be implemented with Unity and better tech stack

## Accomplishments that I'm proud of

The very idea of immersive platform for video chat is an accomplishment in itself. It is going to revolutionize the social networking idea in future. It has applications in corporate and personal lives as well.
The real time segmentation is lossy but still works. To pull off a video chat segmentation was a great learning for me.
I made this alone with my summer grad school which was really hectic. This helped me to believe in myself that I can manage time in a more efficient manner and can give good results with such arduous parameters.

## What I learned

This is my first project in React 360 or virtual reality as a whole
I created a neural net by myself for segmentation purposes, i didn't use it though, but still a learning
Going back to basic p2p connections made me revise all the concepts that I had forgotten
Helped me think in a more creative and indigenous way

## What's next for Sair

Implementing this full fledged platform using Unity
Making it available on the VR stores. It must be compatible with all the VR devices
Adding features such as haptic sensor hugs, haptic sensor handshakes, and other such features, which would give the person a sense of touch and feel along with the stream.

## Keynotes:

Github Repo has two sub-directories-(Sair360Web for Virtual Reality App & SairWebDev for Layer1 and Layer2)
Supports only google chrome for now..
