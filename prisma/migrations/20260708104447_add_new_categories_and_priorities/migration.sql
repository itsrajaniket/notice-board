-- AlterTable
ALTER TABLE `Notice` MODIFY `category` ENUM('Exam', 'Event', 'Meeting', 'Maintenance', 'Holiday', 'Alert', 'News', 'General') NOT NULL,
    MODIFY `priority` ENUM('Low', 'Normal', 'High', 'Urgent', 'Critical') NOT NULL;
