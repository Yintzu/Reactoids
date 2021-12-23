export const options = {
  fullScreen: {
    enable: false
  },
  fpsLimit: 144,
  emitters: {
    position: {
      x: 50,
      y: 50
    },
    rate: {
      quantity: 15,
      delay: 0.1
    },
    life: {
      count: 1,
      duration: 0.2,
    },
  },
  particles: {
    move: {
      enable: true,
      outMode: "destroy"
    },
    number: {
      value: 0
    },
    shape: {
      type: "edge"
    },
    life: {
      count: 1,
      duration: {
        value: 0.8
      },
    },
    color: {
      value: ["#ebbe00ff", "#fff"],
      animation: {
        h: {},
        s: {},
        l: {
          count: 100,
          enable: true,
          // offset: -1,
          speed: 100,
          sync: true,
        },
      }
    },
    /*     opacity: {
          random: {
            enable: false,
            // minimumValue: 1
          },
          // value: {
          //   min: 0.1,
          //   max: 1
          // },
          animation: {
            count: 100,
            enable: true,
            speed: 2,
            sync: true,
            destroy: "none",
            startValue: 1,
            minimumValue: 0
          }
        } */
  },
}

export const optionsPlayer = {
  fullScreen: {
    enable: false
  },
  fpsLimit: 144,
  emitters: {
    position: {
      x: 50,
      y: 50
    },
    rate: {
      quantity: 15,
      delay: 0.1
    },
    life: {
      count: 1,
      duration: 0.3,
    },
  },
  particles: {
    move: {
      enable: true,
      outMode: "destroy"
    },
    number: {
      value: 0
    },
    shape: {
      type: "edge"
    },
    life: {
      count: 1,
      duration: {
        value: 2
      },
    },
    color: {
      value: ["#fff", '#eeff00', '#ffd900'],
      animation: {
        h: {},
        s: {},
        l: {
          count: 100,
          enable: true,
          // offset: -1,
          speed: 50,
          sync: true,
        },
      }
    },
  },
}