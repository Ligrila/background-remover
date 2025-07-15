
import { css } from 'lit';

export const loadingSpinnerStyles = css`
  :host {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    backdrop-filter: blur(4px);
    overflow: hidden;
  }

  .sparkle {
    position: absolute;
    color: #fff;
    animation-name: sparkle-effect;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
  }

  @keyframes sparkle-effect {
    0%,
    100% {
      opacity: 0;
      transform: scale(0.5) rotate(0deg);
    }
    50% {
      opacity: 1;
      transform: scale(1) rotate(90deg);
    }
  }

  .sparkle:nth-child(1) {
    top: 20%;
    left: 15%;
    animation-delay: 0.1s;
    animation-duration: 1.8s;
    transform: scale(1.2);
  }
  .sparkle:nth-child(2) {
    top: 80%;
    left: 30%;
    animation-delay: 0.3s;
    animation-duration: 2s;
    transform: scale(0.8);
  }
  .sparkle:nth-child(3) {
    top: 50%;
    left: 50%;
    animation-delay: 0.5s;
    animation-duration: 1.5s;
    transform: scale(1.1);
  }
  .sparkle:nth-child(4) {
    top: 10%;
    left: 75%;
    animation-delay: 0.2s;
    animation-duration: 2.2s;
    transform: scale(1);
  }
  .sparkle:nth-child(5) {
    top: 90%;
    left: 85%;
    animation-delay: 0.6s;
    animation-duration: 1.7s;
    transform: scale(1.3);
  }
  .sparkle:nth-child(6) {
    top: 30%;
    left: 90%;
    animation-delay: 0.8s;
    animation-duration: 1.9s;
    transform: scale(0.9);
  }
  .sparkle:nth-child(7) {
    top: 65%;
    left: 10%;
    animation-delay: 0.4s;
    animation-duration: 2.1s;
    transform: scale(1);
  }
  .sparkle:nth-child(8) {
    top: 5%;
    left: 40%;
    animation-delay: 0.7s;
    animation-duration: 1.6s;
    transform: scale(1.4);
  }
  .sparkle:nth-child(9) {
    top: 45%;
    left: 70%;
    animation-delay: 0.9s;
    animation-duration: 2.3s;
    transform: scale(0.7);
  }
  .sparkle:nth-child(10) {
    top: 75%;
    left: 60%;
    animation-delay: 0.1s;
    animation-duration: 1.8s;
    transform: scale(1.1);
  }
  .sparkle:nth-child(11) {
    top: 25%;
    left: 5%;
    animation-delay: 1s;
    animation-duration: 2s;
    transform: scale(1);
  }
  .sparkle:nth-child(12) {
    top: 95%;
    left: 50%;
    animation-delay: 1.2s;
    animation-duration: 1.5s;
    transform: scale(0.9);
  }
  .sparkle:nth-child(13) {
    top: 60%;
    left: 95%;
    animation-delay: 1.1s;
    animation-duration: 2.4s;
    transform: scale(1.2);
  }
  .sparkle:nth-child(14) {
    top: 15%;
    left: 25%;
    animation-delay: 1.3s;
    animation-duration: 1.9s;
    transform: scale(1);
  }
  .sparkle:nth-child(15) {
    top: 85%;
    left: 5%;
    animation-delay: 1.5s;
    animation-duration: 2.1s;
    transform: scale(1.3);
  }
  .sparkle:nth-child(16) {
    top: 35%;
    left: 35%;
    animation-delay: 1.4s;
    animation-duration: 1.7s;
    transform: scale(0.8);
  }
  .sparkle:nth-child(17) {
    top: 55%;
    left: 80%;
    animation-delay: 1.6s;
    animation-duration: 2s;
    transform: scale(1.1);
  }
  .sparkle:nth-child(18) {
    top: 5%;
    left: 95%;
    animation-delay: 1.8s;
    animation-duration: 1.6s;
    transform: scale(1);
  }
  .sparkle:nth-child(19) {
    top: 95%;
    left: 5%;
    animation-delay: 1.7s;
    animation-duration: 2.2s;
    transform: scale(1.2);
  }
  .sparkle:nth-child(20) {
    top: 70%;
    left: 75%;
    animation-delay: 1.9s;
    animation-duration: 1.8s;
    transform: scale(1);
  }
`;
