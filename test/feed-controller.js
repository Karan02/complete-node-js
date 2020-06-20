const expect = require("chai").expect;
const sinon = require("sinon");
const User = require("../models/user");
const Post = require("../models/post");

const feedController = require("../controllers/feed");
const mongoose = require("mongoose");
describe("feed controller", function (done) {
  // before runs once, before all test cases
  before(function (done) {
    mongoose
      .connect("mongodb://127.0.0.1:27017/test-messages")
      .then((result) => {
        const user = new User({
          email: "test@test.com",
          password: "asdasd",
          name: "test",
          posts: [],
          _id: "5c0f66b979af55031b34728a",
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });
  it("should add a created post to the posts of the creator", function (done) {
    // sinon.stub(User,"findOne")
    // User.findOne.throws()
    const req = {
        body: {
          title: "Test Post",
          content: "A Test Post",
        },
        file: {
          path: "abc",
        },
        userId: "5c0f66b979af55031b34728a",
      };
      const res = {
        status: function () {
          return this;
        },
        json: function () {},
      };
  
      feedController.createPost(req, res, () => {}).then((savedUser) => {
        expect(savedUser).to.have.property("posts");
        expect(savedUser.posts).to.have.length(1);
        done();
      });
  });

  //other hooks
  beforeEach(function () {});
  afterEach(function () {});

  //done is for async code
  after(function (done) {
    User.deleteMany({}).then(() => {
      mongoose.disconnect().then(() => {
        done();
      });
    });
  });
});
