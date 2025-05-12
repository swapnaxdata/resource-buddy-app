import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
const About = () => {
	return (
		<MainLayout>
			<div className="container mx-auto py-12 px-4">
				<div className="max-w-4xl mx-auto">
					<div className="flex flex-col md:flex-row items-center gap-8 mb-12">
						<div className="w-48 h-48 rounded-full overflow-hidden">
							<img
								src="src/components/resources/souji.jpg"
								alt="Creator Profile"
								className="w-full h-full object-cover"
							/>
						</div>
						<div className="flex-1 text-center md:text-left">
							<h1 className="text-4xl font-bold text-primary-purple mb-4">
								About Study Buddy
							</h1>
							<p className="text-lg text-gray-600 mb-4">
								Major Project Assignment - 2025
							</p>
							<p className="text-gray-500">
								Created by K Sowjanya
								<br />
								Nandi Institute of Management & Science
								<br />
								Bachelor of Computer Applications
							</p>
						</div>
					</div>

					<div className="space-y-8">
						<section>
							<h2 className="text-2xl font-semibold text-primary-purple mb-4">
								Project Overview
							</h2>
							<p className="text-gray-600">
								Resource Buddy is a comprehensive study resource management
								application designed to help students organize and access their
								learning materials efficiently. This project was developed as
								part of my major project assignment, focusing on creating a
								practical solution for modern educational needs.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold text-primary-purple mb-4">
								Key Features
							</h2>
							<ul className="list-disc list-inside text-gray-600 space-y-2">
								<li>Centralized resource management</li>
								<li>Smart organization and categorization</li>
								<li>Easy sharing and collaboration</li>
								<li>Intuitive user interface</li>
								<li>Cross-platform accessibility</li>
							</ul>
						</section>

						<section>
							<h2 className="text-2xl font-semibold text-primary-purple mb-4">
								Technologies Used
							</h2>
							<div className="flex flex-wrap gap-2">
								{["React", "TypeScript", "Tailwind CSS", "Node.js"].map(
									(tech) => (
										<span
											key={tech}
											className="px-3 py-1 bg-primary-purple/10 text-primary-purple rounded-full text-sm"
										>
											{tech}
										</span>
									)
								)}
							</div>
						</section>

						<section className="text-center mt-12">
							<Button
								variant="default"
								className="bg-primary-purple hover:bg-primary-purple/90"
								onClick={() =>
									window.open(
										"https://github.com/swapnaxdata/resource-buddy-app",
										"_blank"
									)
								}
							>
								View Project on GitHub
							</Button>
						</section>
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default About;
