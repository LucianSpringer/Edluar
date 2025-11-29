import { DatabaseManager } from './database/Database';
import { JobOpeningRepository } from './repositories/JobOpeningRepository';
import { CandidateRepository } from './repositories/CandidateRepository';
import { ApplicationRepository } from './repositories/ApplicationRepository';
import { ActivityRepository } from './repositories/ActivityRepository';

const seedTestData = async () => {
    try {
        console.log('🌱 Seeding test data...');
        const db = DatabaseManager.getInstance();
        await db.waitForInit();

        // Create test job
        console.log('Creating test job...');
        const job = await JobOpeningRepository.create({
            userId: 1,
            title: 'Senior Product Designer',
            description: 'We are looking for a Senior Product Designer',
            department: 'Design',
            location: 'Remote',
            employmentType: 'full-time',
            status: 'active'
        });
        console.log(`✅ Job created: ID ${job.id} - ${job.title}`);

        // Create test candidates and applications
        const testApplicants = [
            { firstName: 'Sarah', lastName: 'Miller', email: 'sarah@example.com', tags: ['Figma', 'UX'], source: 'LinkedIn', status: 'applied' },
            { firstName: 'Liam', lastName: 'Chen', email: 'liam@example.com', tags: ['React', 'Senior'], source: 'Referral', status: 'phone_screen' },
            { firstName: 'Emma', lastName: 'Wilson', email: 'emma@example.com', tags: ['Product Design'], source: 'Direct', status: 'interview' },
            { firstName: 'David', lastName: 'Kim', email: 'david@example.com', tags: ['Design Systems'], source: 'LinkedIn', status: 'offer' },
        ];

        for (const applicant of testApplicants) {
            // Upsert candidate
            const candidate = await CandidateRepository.findOrCreateByEmail(applicant.email, {
                firstName: applicant.firstName,
                lastName: applicant.lastName,
                tags: applicant.tags
            });

            // Create application
            const application = await ApplicationRepository.create({
                jobId: job.id,
                candidateId: candidate.id,
                status: applicant.status,
                source: applicant.source
            });

            // Create initial activity
            await ActivityRepository.create({
                applicationId: application.id,
                type: 'status_change',
                content: `Application submitted for ${job.title}`
            });

            console.log(`✅ Application created: ${applicant.firstName} ${applicant.lastName} → ${applicant.status}`);
        }

        console.log('\n🎉 Test data seeded successfully!');
        console.log(`Job ID: ${job.id}`);
        console.log('You can now view the Kanban board in the UI');

    } catch (error) {
        console.error('❌ Error seeding test data:', error);
    }
};

seedTestData();
