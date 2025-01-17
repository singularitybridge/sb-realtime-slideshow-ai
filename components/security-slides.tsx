import React, { useEffect } from 'react';
import { useSlideStore } from '@/hooks/use-slides-store';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface SlideBlock {
  title: string;
  content: string;
}

interface Slide {
  title: string;
  description: string;
  blocks: SlideBlock[];
}

const slides: Slide[] = [
  {
    title: "Understanding Security Audits",
    description: "A comprehensive security audit is a systematic evaluation of your organization's information security measures. It involves a detailed examination of your system's security controls, policies, and procedures to ensure they meet industry standards and effectively protect sensitive data. Through this process, we identify potential vulnerabilities, assess risks, and provide actionable recommendations for strengthening your security posture.",
    blocks: [
      {
        title: "Scope Definition",
        content: "Define boundaries and objectives of the security audit, including systems, networks, and applications to be evaluated."
      },
      {
        title: "Risk Assessment",
        content: "Identify potential threats, vulnerabilities, and their impact on business operations and data security."
      },
      {
        title: "Compliance Check",
        content: "Verify adherence to industry standards, regulations, and internal security policies."
      }
    ]
  },
  {
    title: "Security Review Process",
    description: "The security review process is a methodical approach to evaluating your organization's security measures. It combines automated scanning, manual testing, and expert analysis to create a complete picture of your security landscape. Our team examines everything from network infrastructure to application security, ensuring no potential vulnerability goes unnoticed. This thorough approach helps identify both technical and procedural security gaps.",
    blocks: [
      {
        title: "Documentation Review",
        content: "Examine security policies, procedures, and system documentation for completeness and effectiveness."
      },
      {
        title: "Technical Assessment",
        content: "Conduct vulnerability scans, penetration testing, and security control evaluation."
      },
      {
        title: "Gap Analysis",
        content: "Identify discrepancies between current security posture and desired security state."
      }
    ]
  },
  {
    title: "Implementing Security Improvements",
    description: "Implementing security improvements is a strategic process that transforms audit findings into actionable security enhancements. We work closely with your team to develop a prioritized roadmap for addressing identified vulnerabilities. This phase focuses on both quick wins and long-term structural improvements, ensuring that security measures are not only implemented but are sustainable and adaptable to evolving threats.",
    blocks: [
      {
        title: "Prioritization",
        content: "Rank security issues based on risk level and potential impact to focus remediation efforts."
      },
      {
        title: "Action Planning",
        content: "Develop detailed remediation plans with specific tasks, timelines, and responsibilities."
      },
      {
        title: "Continuous Monitoring",
        content: "Implement ongoing security monitoring and regular reassessment of security controls."
      }
    ]
  }
];

export const SecuritySlides = () => {
  const { currentSlide, nextSlide, prevSlide, setTotalSlides } = useSlideStore();

  useEffect(() => {
    setTotalSlides(slides.length);
  }, [setTotalSlides]);

  return (
    <div className="h-full flex flex-col p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="h-[calc(100%-3rem)]"
        >
          <div className="flex flex-col h-full">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-4">{slides[currentSlide].title}</h1>
              <p className="text-lg leading-relaxed text-gray-600">{slides[currentSlide].description}</p>
            </div>
            
            <div className="mt-auto mb-6">
              <div className="grid grid-cols-3 gap-6">
              {slides[currentSlide].blocks.map((block, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="group bg-white hover:bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col h-full">
                    <div className="mb-3">
                      <div className="w-8 h-8 mb-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                        <span className="text-lg font-semibold text-blue-600/80">{index + 1}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {block.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {block.content}
                    </p>
                  </div>
                </motion.div>
              ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between items-center h-12">
        <Button
          onClick={prevSlide}
          variant="outline"
          disabled={currentSlide === 0}
        >
          Previous
        </Button>
        <span className="text-sm text-gray-500">
          {currentSlide + 1} / {slides.length}
        </span>
        <Button
          onClick={nextSlide}
          variant="outline"
          disabled={currentSlide === slides.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
