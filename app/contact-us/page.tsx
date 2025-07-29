"use client";
import { motion, Variants } from 'framer-motion';
import  MyBackground  from '@/components/MyBackground';
import Navbar from '@/components/Navbar';
const ContactUsPage = () => {
  const contactItems = [
    {
      id: 1,
      title: 'Email Us',
      value: 'support@company.com',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 2,
      title: 'Toll Free',
      value: '1-800-123-4567',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      )
    },
    {
      id: 3,
      title: 'Visit Us',
      value: '123 Business Avenue, Tech City, TC 10001',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  // Define proper TypeScript types for variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <MyBackground>
        <Navbar/>
      <div className="max-w-6xl py-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-purple-100 text-xl max-w-2xl mx-auto">
            {"We'd love to hear from you! Reach out through any of these channels."}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {contactItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ 
                y: -10,
                scale: 1.03,
                transition: { duration: 0.3 }
              }}
              className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white border-opacity-20"
            >
              <div className="text-purple-500 mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-purple-400 mb-2">{item.title}</h3>
              <p className="text-purple-400 text-lg">{item.value}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-semibold text-white mb-4">Business Hours</h2>
          <p className="text-purple-100 text-lg">Monday - Friday: 9AM - 6PM</p>
          <p className="text-purple-100 text-lg">Saturday: 10AM - 4PM</p>
        </motion.div>
      </div>
    </MyBackground>
  );
};

export default ContactUsPage;