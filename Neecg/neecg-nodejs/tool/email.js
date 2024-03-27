const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.qq.com',
  port: 465,
  secure: true,  
  auth: {
    user: '1715281438@qq.com',
    pass: 'lbwhlvanamvudfie'
  }
});

function sendMail(mailOptions) {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
}

class Testimonial {
  /** @type {Array<String>} */
  codes;
  /** @type {Number} 默认有效期时间为10分钟 */
  deleteTime;

  constructor(deleteTime = 60 * 10 * 1000) {
    this.deleteTime = deleteTime;
    this.codes = [];
  }

  create() {
    while (true) {
      const code = Array(6).fill(0).map(_ => Math.floor(Math.random() * 10)).join('');
      if (!this.codes.includes(code)) {
        this.push(code);
        return code;
      }
    }
  }

  push(code) {
    this.codes.push(code);
    const index = this.codes.length - 1;
    const oldItem = this.codes[index];
    setTimeout(() => {
      const code = this.codes[index];
      if (code === oldItem) this.codes.splice(index, 1);
    }, this.deleteTime);
  }

  existe(code) {
    const findIndex = this.codes.findIndex(item => item === code);
    if (findIndex === -1) return false;
    this.codes.splice(findIndex, 1);
    return true;
  }
}

const testimonial = new Testimonial();

module.exports = { sendMail, testimonial };