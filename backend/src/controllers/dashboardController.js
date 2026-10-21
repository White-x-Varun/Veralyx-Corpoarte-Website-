import Job from '../models/Job.js';
import Application from '../models/Application.js';
import ContactEnquiry from '../models/ContactEnquiry.js';
import BlogPost from '../models/BlogPost.js';
import Project from '../models/Project.js';
import Testimonial from '../models/Testimonial.js';
import asyncHandler from '../utils/asyncHandler.js';
import { publicEnquiry } from '../services/mappers.js';

export const getDashboard = asyncHandler(async (_req, res) => {
  const [
    jobs,
    publishedJobs,
    applications,
    enquiries,
    newEnquiries,
    blogPosts,
    publishedPosts,
    projects,
    testimonials,
    recentEnquiries,
    recentApplications,
  ] = await Promise.all([
    Job.countDocuments(),
    Job.countDocuments({ status: 'published' }),
    Application.countDocuments(),
    ContactEnquiry.countDocuments(),
    ContactEnquiry.countDocuments({ status: 'new' }),
    BlogPost.countDocuments(),
    BlogPost.countDocuments({ status: 'published' }),
    Project.countDocuments(),
    Testimonial.countDocuments(),
    ContactEnquiry.find().sort({ createdAt: -1 }).limit(5),
    Application.find().populate('jobId', 'title').sort({ createdAt: -1 }).limit(5),
  ]);

  const stats = {
    jobs,
    publishedJobs,
    applications,
    enquiries,
    newEnquiries,
    blogPosts,
    publishedPosts,
    projects,
    testimonials,
  };

  return res.status(200).json({
    success: true,
    data: {
      stats,
      recentEnquiries: recentEnquiries.map(publicEnquiry),
      recentApplications,
    },
    stats,
    recentEnquiries: recentEnquiries.map(publicEnquiry),
  });
});
