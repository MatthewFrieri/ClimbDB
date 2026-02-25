import { Api } from "@/api";
import { Climb } from "@/const";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { useState } from "react";

type DeleteButtonProps = {
	climb: Climb;
	setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DeleteButton({ climb, setRefresh }: DeleteButtonProps) {
	const [isDeleting, setIsDeleting] = useState(false);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const handleDelete = async () => {
		if (isDeleting) return;

		try {
			setIsDeleting(true);
			await Api.delete_climb(climb.id);
			setRefresh((prev) => !prev);
			onOpenChange(); // close modal
		} catch (err) {
			console.error(`Failed to delete climb with id=${climb.id}`, err);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<>
			<Button color="danger" onPress={onOpen}>
				Delete
			</Button>

			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader>Delete climb?</ModalHeader>

							<ModalBody>
								<p>This action cannot be undone. The climb and its media will be permanently deleted.</p>
							</ModalBody>

							<ModalFooter>
								<Button variant="light" onPress={onClose} isDisabled={isDeleting}>
									Cancel
								</Button>
								<Button color="danger" onPress={handleDelete} isLoading={isDeleting}>
									Delete
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
